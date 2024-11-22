export const sendDetectAndFollowSignal = async (signal: string) => {
    const response = await fetch(
        `http://localhost:5000/detect-and-follow?signal=${signal}`
    );
    return response.json();
};

export const sendStopSignal = async () => {
    const response = await fetch(`http://localhost:5000/stop`);
    return response.json();
};

export const sendGPSSignal = async (signal: string) => {
    const response = await fetch(`http://localhost:5000/gps?signal=${signal}`);
    return response.json();
};
