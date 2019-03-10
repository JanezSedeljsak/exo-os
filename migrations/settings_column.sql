ALTER TABLE users ADD COLUMN settings DEFAULT '{
    navigationMenu: [
        {name: "games", enabled: true},
        {name: "calculator", enabled: true},
        {name: "notes", enabled: true},
        {name: "music", enabled: true},
        {name: "video", enabled: true},
        {name: "weather", enabled: true},
        {name: "maps", enabled: true},
        {name: "photoEditor", enabled: true},
        {name: "sysInfo", enabled: true},
        {name: "systemControl", enabled: true}
    ]
}';
