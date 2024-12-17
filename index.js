const setUpTrigger = () => {
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
        if (trigger.getHandlerFunction() === 'main') {
            return;
        }
    }

    // Retrieve the form by its ID
    const form = FormApp.openById('1QKTXGtkB6O4sZvGRN08Jtl6iUJDnJSQ2jcGB-JjluNc');

    // Create the trigger for form submission
    ScriptApp.newTrigger('main')
        .forForm(form)
        .onFormSubmit()
        .create();
}
let numberOfPResponse = 0;

function main() {
    try {
        const latestResponse = getLastResponse();
        Logger.log(getLastResponse());
        Logger.log('Latest Response: ' + JSON.stringify(latestResponse));

        const {subEmail} = parseResponse(latestResponse);
        Logger.log(parseResponse(latestResponse))
        if (!subEmail) {
            Logger.log('No email address found for the latest response.');
            return;
        }



        const mail = getRecipientEmail();

        numberOfPResponse++;
        const subject = `$New response! by ${subEmail}`;
        const body = 'the of people who have submitted the google form is ' +  numberOfPResponse++ ;


        // this is for sending the email to me
        GmailApp.sendEmail(mail, subject, body);
        sendEmailToPerson(subEmail);

    } catch (error) {
        Logger.log('Error in emailMe function: ' + error.message);
    }
}

function parseResponse(response) {
    const [timeOfSubmit, subEmail, ...rest] = response;
    return {subEmail};
}

function getLastResponse() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('formResponses');
    const lastRow = sheet.getLastRow();

    if (lastRow === 0) {
        throw new Error('No responses found in the form.');
    }
    return sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function getRecipientEmail() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('email');
    const recipientEmail = sheet.getRange('D2').getValue();

    if (!recipientEmail) {
        throw new Error('Recipient email is missing.');
    }
    return recipientEmail;
}

function createEmailBody() {
    return `Hey there thank you for your response!\n If there is anything else you would like to know about the program, please feel free to reach out to me at this email.\n\nThank you for your time`;
}

function sendEmailToPerson(subEmail) {
    const email = subEmail;
    const subject = 'Thank your for your response!';
    const body = createEmailBody();
    GmailApp.sendEmail(email, subject, body);
}


function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
        return false;
    } else {
        return true;
    }
}


