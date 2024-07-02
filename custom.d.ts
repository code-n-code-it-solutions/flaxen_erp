// custom.d.ts
interface NavigatorUAData {
    platform: string;
    // Add any other properties you need from userAgentData
}

interface Navigator {
    userAgentData?: NavigatorUAData;
}
