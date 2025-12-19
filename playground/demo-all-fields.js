export const ALL_FIELDS_SECTION = {
  name: "misc",
  fields: [
    {
      label: "Date",
      name: "start_date",
      type: "date",
      help: "When would you like to start?"
    },
    {
      label: "Radio-button",
      name: "notification_type",
      type: "radioButton",
      options: [
        { value: "all", label: "All" },
        { value: "important", label: "Important Only" },
        { value: "none", label: "None" }
      ]
    },
    {
      label: "Radio Group",
      name: "music",
      type: "radio",
      options: [
        { value: "rock", label: "Rock" },
        { value: "jazz", label: "Jazz" },
        { value: "classical", label: "Classical" }
      ],
    },
    {
      label: "Range",
      name: "volume",
      type: "range",
      min: 0,
      max: 100,
      help: "Adjust the volume level"
    },
    {
      label: "Rating",
      name: "rating",
      type: "rating",
      help: "Rate your experience"
    },
    {
      label: "Select",
      name: "country_single",
      type: "select",
      options: [
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "au", label: "Australia" }
      ]
    },
    {
      label: "Select Multiple",
      name: "country_multiple",
      type: "select",
      multiple: true,
      clearable: true,
      options: [
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "au", label: "Australia" }
      ]
    },
    {
      label: "Text",
      name: "username",
      type: "text",
      placeholder: "Enter username",
      help: "Choose a unique username"
    },
    {
      label: "Number",
      name: "age",
      type: "number",
      min: 18,
      max: 100,
      help: "Must be 18 or older"
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      requireConfirmation: true,
      passwordToggle: true,
      help: "Choose a strong password"
    },
    {
      label: "Textarea",
      name: "bio",
      type: "textarea",
      placeholder: "Tell us about yourself",
      maxlength: 30,
      help: "Brief description about you (30 characters or less)"
    },
    {
      name: "this-or-that",
      type: "toggleField",
      defaultTo: 0,
      labels: ["Alternatively, enter your seed phrase.", "Alternatively, enter your password"],
      fields: [
        {
          name: "password",
          label: "Enter Current Password",
          type: "password",
          passwordToggle: true,
          required: true,
        },
        {
          name: "seedphrase",
          label: "Enter Recovery Phrase (12-words)",
          type: "seedphrase",
          placeholder: "hungry tavern drumkit weekend dignified turmoil cucumber pants karate yacht treacle chump",
          required: true,
        },
      ]
    },
    {
      label: "Toggle Switch",
      name: "dark_mode",
      type: "toggle",
      help: "Switch between light and dark mode"
    },
    {
      label: "Checkbox",
      name: "terms",
      type: "checkbox",
      help: "Please accept our terms and conditions"
    },
    {
      label: "Color",
      name: "fave_color",
      type: "color",
      help: "Pick your preferred theme color",
      value: "#00b9f1"
    },
  ]
}