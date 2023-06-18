/**
     * The function gets the user's time zone and returns it, or finds the closest match if the user's
     * time zone is not in the available options.
     * @returns the user's time zone, either by directly returning it if it is one of the available
     * options, or by finding the closest match if it is not.
     */
export function getUserTimeZone() {
    const availableTimeZones = [
        "Pacific/Auckland",
        "America/New_York",
        "Asia/Tokyo",
        "Europe/London",
        "America/Los_Angeles",
        "Australia/Sydney",
        "Europe/Paris",
        "Asia/Dubai",
        "America/Chicago",
        "Asia/Shanghai",
        "America/Toronto",
        "Europe/Berlin",
        "Asia/Singapore",
        "America/Denver",
        "Asia/Kolkata",
        "Africa/Johannesburg",
        "America/Mexico_City",
        "Europe/Moscow",
        "Pacific/Honolulu",
        "America/Sao_Paulo"
    ];

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Check if userTimeZone is one of the available options
    if (availableTimeZones.includes(userTimeZone)) {
        return userTimeZone;
    }

    // If userTimeZone is not in the available options, find the closest match
    let closestMatch = availableTimeZones[0];
    let closestOffset = Math.abs(
        Intl.DateTimeFormat(undefined, { timeZone: closestMatch }).resolvedOptions().timeZoneOffset
    );

    for (let i = 1; i < availableTimeZones.length; i++) {
        const timeZone = availableTimeZones[i];
        const offset = Math.abs(
            Intl.DateTimeFormat(undefined, { timeZone }).resolvedOptions().timeZoneOffset
        );

        if (offset < closestOffset) {
            closestMatch = timeZone;
            closestOffset = offset;
        }
    }

    return closestMatch;
}