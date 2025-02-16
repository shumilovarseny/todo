const accesRules = (memberRole, userRole) => {
    let available;
    switch (memberRole) {
        case "a":
            available = ["s"];
            break;
        case "m":
            available = ["s", "a"];
            break;
        default:
            available = []
    }
    return available.includes(userRole);
}

export default accesRules;