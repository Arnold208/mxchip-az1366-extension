// telemetry_data.c
#include "telemetry_data.h"
#include "sensor.h"

TelemetryData read_telemetry_data(void)
{
    TelemetryData data;

    // Read humidity, temperature, and pressure data
    lps22hb_t lps22hb_data = lps22hb_data_read();
    hts221_data_t hts221_data = hts221_data_read();
    data.humidity = hts221_data.humidity_perc;
    data.temperature = lps22hb_data.temperature_degC;
    data.pressure = lps22hb_data.pressure_hPa;

    // Read magnetometer data
    lis2mdl_data_t lis2mdl_data = lis2mdl_data_read();
    data.magnetometerX = lis2mdl_data.magnetic_mG[0];
    data.magnetometerY = lis2mdl_data.magnetic_mG[1];
    data.magnetometerZ = lis2mdl_data.magnetic_mG[2];

    // Read accelerometer data
    lsm6dsl_data_t lsm6dsl_data = lsm6dsl_data_read();
    data.accelerometerX = lsm6dsl_data.acceleration_mg[0];
    data.accelerometerY = lsm6dsl_data.acceleration_mg[1];
    data.accelerometerZ = lsm6dsl_data.acceleration_mg[2];

    // Read gyroscope data
    data.gyroscopeX = lsm6dsl_data.angular_rate_mdps[0];
    data.gyroscopeY = lsm6dsl_data.angular_rate_mdps[1];
    data.gyroscopeZ = lsm6dsl_data.angular_rate_mdps[2];

    return data;
}
