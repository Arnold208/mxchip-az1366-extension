// telemetry_data.h
#ifndef TELEMETRY_DATA_H
#define TELEMETRY_DATA_H

typedef struct {
    float humidity;
    float temperature;
    float pressure;
    float magnetometerX;
    float magnetometerY;
    float magnetometerZ;
    float accelerometerX;
    float accelerometerY;
    float accelerometerZ;
    float gyroscopeX;
    float gyroscopeY;
    float gyroscopeZ;
} TelemetryData;

TelemetryData read_telemetry_data(void);

#endif // TELEMETRY_DATA_H
