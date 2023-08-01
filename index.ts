import DiscordJS from "discord.js";
import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { getModal } from "./utils";
import express from "express";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Github issues bot!");
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

const client = new DiscordJS.Client({
    intents: ["Guilds", "GuildMessages"],
});

client.on("ready", () => {
    console.log("issue bot ready");
    const guildId = process.env.GUILD_ID || "";

    const guild = client.guilds.cache.get(guildId);

    let commands;

    if (guild) {
        commands = guild.commands;
    } else {
        commands = client.application?.commands;
    }

    commands?.create({
        name: "Open Developer Issue",
        type: 3,
    });
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isMessageContextMenuCommand()) {
        const { commandName, targetMessage } = interaction;
        if (commandName === "Open Developer Issue") {
            const modal = getModal(targetMessage.content, targetMessage.author.username, interaction.user.username);
            interaction.showModal(modal);
        }
    } else if (interaction.isModalSubmit()) {
        const { fields } = interaction;
        const issueTitle = fields.getTextInputValue("issueTitle");
        const issueDescription = fields.getTextInputValue("issueDescription");
        const issueSubmitter = fields.getTextInputValue("issueSubmitter");
        const issueAuthor = fields.getTextInputValue("issueAuthor");

        const installationId = process.env.GITHUB_INSTALLATION_ID || 0;

        const auth = createAppAuth({
            appId: process.env.GITHUB_APP_ID || "",
            privateKey: process.env.GITHUB_PRIVATE_KEY || "",
            installationId: installationId,
        });

        
            // Get an installation access token
            const { token } = await auth({
              type: 'installation',
            });

        const octokit = new Octokit({
            auth: token,
            baseUrl: "https://api.github.com",
        });

        octokit.rest.issues
            .create({
                owner: process.env.GITHUB_USERNAME || "",
                repo: process.env.GITHUB_REPOSITORY || "",
                title: issueTitle,
                body: `**Submitter**: ${issueSubmitter}\n**Author**: ${issueAuthor}\n\n${issueDescription}`,
            })
            .then((res) => {
                interaction.reply(`Issue created: ${res.data.html_url}`);
                console.log `Issue created: ${res.data.html_url}`;
            });
    }
});

client.login(process.env.BOT_TOKEN);
