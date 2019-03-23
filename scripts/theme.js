let brightCSS = (`
    .box-window-top h3 {
        color: black;
    }
`);

let darktCSS = (`
    .box-window-top h3 {
        color: white;
    }
`);

exports.determineTheme = color => {
    let commonChanges = (`
        .box-window-top {
            background-color: #${color};
        }
    `);
    let r, g, b, hsp;
    color = +("0x" + color
        .slice(1)
        .replace(color.length < 5 && /./g, '$&$&')
    );
    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
    hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );
    return hsp > 85 ? brightCSS.concat(commonChanges) : darktCSS.concat(commonChanges);
}