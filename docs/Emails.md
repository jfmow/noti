# Emails

## Setup

Copy the 2 default emails i've provided in the pocketbase repo to your custom_emails. Make sure to set there names as they are defined in the template file. They should look like this (if not more emails because i've probs made more since then) TO ADD THE EMAIL HTML CLICK THE VIEW SOURCE BUTTON IN THE RICH TEXT EDITOR AND PASTE/SAVE in that just because its a template.

![Preview of email templates](https://github.com/jfmow/noti/assets/103403655/cc15db17-eb93-4432-acea-4b315000c9f5)

Now when a user signs up with email auth (sso) they will be sent an email which ins't a big error, you **must** have email setup in the settings pannel for email to work remeber!

## How to edit
Click on the email you want to edit then start editing with the editor. If you click the view source button on the email auth email you will see that the <a> button has a var in it. leave it. don't touch. that must be included in the email same with the token so the user can login/signup properly.

![image](https://github.com/jfmow/noti/assets/103403655/49a43b28-950e-4af7-ac27-63170e6e5d60)

# Custom emails
If you want to add more custom emails, make them here, give them a name and content, and vars if you have something per user and then follow the steps below to add it to the exe so the backend can send them.

```go
//Create map to store email var data to pass into email html loader function
emailData := make(map[string]interface{})

//Add data to map based on defined var names. Case sensitive
emailData["token"] = tokenRecord.Get("token").(string)
emailData["message"] = "Copy the code below or use the button to confirm your email to continue the signup process."
emailData["footer"] = "If you didn't request to signup you can safely ignore this email as the account will not be created without it."

emailData["subject"] = "Login code"
emailData["recp"] = "johndoe@gmail.com"
emailData["recpName"] = "John doe"

//Send the email and load the vars data into template from db.
//You could put this in a seprate func for cleaner code and just pass the email data to that func for here and the pocketbase app instance.

//app = the pb app instace created in the main.go
//"emailAuth" = the "name" of the template in the db (case senstive)
email, err := emails.LoadEmailDataToHTML(app, "emailAuth", emailData)
if err != nil {
  logDescriptiveErrorToLogs(app, "Failed to write the email data to the html file or load html file", err)
  return genericEmailAuthServerError
}

subject := emailData["subject"].(string)
recp := emailData["recp"].(string)
recpName := emailData["recpName"].(string)

go emails.SendCustomEmail(subject, []mail.Address{
  {Name: recpName, Address: recp},
}, email, app)
```

