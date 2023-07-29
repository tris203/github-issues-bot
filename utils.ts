import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

export const getModal = (description: string, authorUser: string, submitUser: string) => {
    const modal = new ModalBuilder()
        .setTitle("Create github issue")
        .setCustomId("AwesomeForm");

    const issueTitle = new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setCustomId("issueTitle")
        .setLabel("Issue title");

    const issueDescription = new TextInputBuilder()
        .setStyle(TextInputStyle.Paragraph)
        .setCustomId("issueDescription")
        .setLabel("Issue description")
        .setValue(description);

    const issueAuthor = new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setCustomId("issueAuthor")
        .setLabel("Issue Author")
        .setValue(authorUser)

    const issueSubmitter = new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setCustomId("issueSubmitter")
        .setLabel("Issue Submitter")
        .setValue(submitUser);
        

    const rows = [issueTitle, issueDescription, issueAuthor, issueSubmitter].map((component) =>
        new ActionRowBuilder<TextInputBuilder>().addComponents([component])
    );

    // Add action rows to form
    modal.addComponents(rows);

    return modal;
};
