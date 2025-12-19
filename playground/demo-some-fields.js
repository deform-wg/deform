export const DEMO_FIELDS = {
  sections: [
    {
      name: 'profile',
      fields:[
        {
          label: "First name",
          name: 'first',
          type: 'text',
          placeholder: "Eg: Bob",
          help: "Enter your first name",
          required: true,
        },
        {
          label: "Last name",
          name: 'last',
          type: 'text',
          placeholder: "Eg: Odenkirk",
          help: "Enter your last name"
        },
        {
          label: "Preferred Pizza",
          name: "pizza",
          type: "select",
          options: [
            { value: "margherita", label: "Margherita" },
            { value: "supreme", label: "Supreme" },
            { value: "hawaiian", label: "Hawaiian" },
            { value: "pepperoni", label: "Pepperoni" },
            { value: "bbqchicken", label: "BBQ Chicken" }
          ]
        }
      ]
    },
    {
      name: 'contact',
      fields:[
        {
          label: "Email address",
          name: 'email_address',
          type: 'email',
          pattern: "[^\\s@]+@[^\\s@]+\\.[^\\s@]+",
          placeholder: "Eg: pat@gmail.com",
          help: "Enter your email address",
          required: true,
        },
        {
          label: "Phone number",
          name: 'phone',
          type: 'text',
          placeholder: "eg: 0430125515",
          help: "Enter your phone number"
        },
        {
          label: "Preferred contact method",
          name: "contact_method",
          type: "radio",
          options: [
            { value: "email", label: "Email", awesome: true },
            { value: "sms", label: "SMS", chicken: "nugget" },
          ]
        },
        {
          label: "Receive Weekly Digest",
          name: 'digest',
          type: 'checkbox',
          help: "Sent to you once a week"
        },
      ]
    },
    {
      name: 'advanced',
      fields: [
        {
          label: "User Type",
          name: "userType",
          type: "select",
          value: "individual",
          options: [
            { value: "individual", label: "Individual" },
            { value: "business", label: "Business" }
          ],
          help: "Select your user type"
        },
        {
          label: "Company Name",
          name: "companyName",
          type: "text",
          placeholder: "Enter company name",
          help: "Required for business accounts",
          // Only show when userType equals "business"
          revealOn: ["userType", "=", "business"]
        },
        {
          label: "Account Type",
          name: "accountType",
          type: "select",
          value: "premium",
          options: [
            { value: "free", label: "Free" },
            { value: "premium", label: "Premium" }
          ],
          help: "Choose your account type"
        },
        {
          label: "Downgrade Reason",
          name: "downgradeReason",
          type: "textarea",
          placeholder: "Why do you want to downgrade?",
          help: "We love to hear your feedback",
          // Show when accountType is not "premium" (and has a value)
          revealOn: ["accountType", "!=", "premium"]
        },
        {
          label: "Age",
          name: "age",
          type: "number",
          placeholder: "Enter your age",
          min: 0,
          help: "Enter your current age"
        },
        {
          label: "Parental Consent Required",
          name: "parentalConsent",
          type: "checkbox",
          help: "Required for users under 18",
          // Show when age is less than 18
          revealOn: (currentState, currentValues) => {
            const age = parseInt(currentValues.age) || 0;
            return age < 18;
          }
        },
        {
          label: "Country",
          name: "country",
          type: "select",
          options: [
            { value: "US", label: "United States" },
            { value: "CA", label: "Canada" },
            { value: "UK", label: "United Kingdom" },
            { value: "AU", label: "Australia" }
          ],
          help: "Select your country"
        },
        {
          label: "State/Province",
          name: "state",
          type: "text",
          placeholder: "Enter state or province",
          help: "Required for US and Canada",
          // Show only for US and Canada
          revealOn: (currentState, currentValues) => {
            return ["US", "CA"].includes(currentValues.country);
          }
        },
        {
          label: "New Password",
          name: "newPassword",
          type: "password",
          placeholder: "Enter new password",
          help: "Choose a strong password",
          requireConfirmation: true,
          passwordToggle: true,
          required: true
        },
        {
          name: "authentication-method",
          type: "toggleField",
          defaultTo: 0,
          labels: [
            "Alternatively, enter your seed phrase.",
            "Alternatively, enter your password."
          ],
          fields: [
            {
              name: "password",
              label: "Enter Current Password",
              type: "password",
              passwordToggle: true,
              required: true,
              help: "Enter your existing password"
            },
            {
              name: "seedphrase",
              label: "Enter Recovery Phrase (12-words)",
              type: "seedphrase",
              placeholder: "hungry tavern drumkit weekend dignified turmoil cucumber pants karate yacht treacle chump",
              required: true,
              help: "Enter your 12-word recovery phrase"
            },
          ]
        }
      ]
    }
  ]
}