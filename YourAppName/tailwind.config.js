// tailwind.config.js

module.exports = {
        content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
        theme: {
            extend: { 
                colors: {
                    'text': '#040209',
                    'background': '#f2effb',
                    'purple': '#67519A',
                    'purpleDark': '#443666',
                    'blue': '#516d9a',
                    'green': '#699a51',
                },
    
            },
        },
        plugins: [],
    }