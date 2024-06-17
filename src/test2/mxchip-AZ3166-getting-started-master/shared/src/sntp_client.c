#include "sntp_client.h"

#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "nx_api.h"
#include "networking.h"

#define SNTP_UPDATE_EVENT 1

// Time to wait for each server poll
#define SNTP_WAIT_TIME (10 * NX_IP_PERIODIC_RATE)

// Seconds between Unix Epoch (1/1/1970) and NTP Epoch (1/1/1999)
#define UNIX_TO_NTP_EPOCH_SECS 0x83AA7E80

static TX_EVENT_FLAGS_GROUP sntp_flags;

// Variables to keep track of time
static ULONG sntp_last_time = 0;
static ULONG tx_last_ticks = 0;

static void set_sntp_time(ULONG unix_time)
{
    // Stash the Unix and ThreadX times
    sntp_last_time = unix_time;
    tx_last_ticks = tx_time_get();

    printf("\tSNTP time update: %lu\r\n", unix_time);
    printf("SUCCESS: SNTP initialized\r\n");
}

static int parse_month(const char *month_str) {
    if (strcmp(month_str, "Jan") == 0) return 0;
    if (strcmp(month_str, "Feb") == 0) return 1;
    if (strcmp(month_str, "Mar") == 0) return 2;
    if (strcmp(month_str, "Apr") == 0) return 3;
    if (strcmp(month_str, "May") == 0) return 4;
    if (strcmp(month_str, "Jun") == 0) return 5;
    if (strcmp(month_str, "Jul") == 0) return 6;
    if (strcmp(month_str, "Aug") == 0) return 7;
    if (strcmp(month_str, "Sep") == 0) return 8;
    if (strcmp(month_str, "Oct") == 0) return 9;
    if (strcmp(month_str, "Nov") == 0) return 10;
    if (strcmp(month_str, "Dec") == 0) return 11;
    return -1;
}

static ULONG calculate_epoch_time(int year, int month, int day, int hour, int minute, int second) {
    // Days of each month in a non-leap year
    const int days_in_month[] = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
    // Calculate the number of days since epoch
    ULONG days = 0;
    for (int y = 1970; y < year; y++) {
        days += (y % 4 == 0 && (y % 100 != 0 || y % 400 == 0)) ? 366 : 365;
    }
    for (int m = 0; m < month; m++) {
        days += days_in_month[m];
        if (m == 1 && (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0))) {
            days += 1; // February in a leap year
        }
    }
    days += day - 1; // Days of the current month

    // Convert days to seconds and add the time of the day
    ULONG seconds = days * 86400 + hour * 3600 + minute * 60 + second;
    return seconds;
}

static int compile_time_to_epoch(ULONG* unix_time)
{
    int year, month, day, hour, minute, second;
    char month_str[4];

    // Parse compile date and time
    if (sscanf(__DATE__, "%s %d %d", month_str, &day, &year) != 3) {
        printf("ERROR: Unable to parse compile date\n");
        return -1;
    }
    if (sscanf(__TIME__, "%d:%d:%d", &hour, &minute, &second) != 3) {
        printf("ERROR: Unable to parse compile time\n");
        return -1;
    }

    // Convert month string to month number
    month = parse_month(month_str);
    if (month == -1) {
        printf("ERROR: Invalid month in compile date\n");
        return -1;
    }

    // Calculate Unix epoch time
    *unix_time = calculate_epoch_time(year, month, day, hour, minute, second);

    // Add 3 minutes (180 seconds) to the compile time
    *unix_time += 180;

    return 0; // Success
}

static UINT sntp_client_run()
{
    UINT status;
    ULONG unix_time;

    printf("\r\nReading compile time\r\n");

    // Get the compile time
    status = compile_time_to_epoch(&unix_time);
    if (status == 0) {
        // Set the fetched time
        set_sntp_time(unix_time);
        status = NX_SUCCESS;
    } else {
        status = NX_NOT_SUCCESSFUL;
    }

    return status;
}

ULONG sntp_time_get()
{
    // Calculate how many seconds have elapsed since the last sync
    ULONG tx_time_delta = (tx_time_get() - tx_last_ticks) / TX_TIMER_TICKS_PER_SECOND;

    // Add this to the last sync time to get the current time
    ULONG sntp_time = sntp_last_time + tx_time_delta;

    return sntp_time;
}

UINT sntp_time(ULONG* unix_time)
{
    *unix_time = sntp_time_get();

    return NX_SUCCESS;
}

UINT sntp_init()
{
    UINT status;

    if ((status = tx_event_flags_create(&sntp_flags, "SNTP")))
    {
        printf("ERROR: Create SNTP event flags (0x%08x)\r\n", status);
    }

    return status;
}

UINT sntp_sync()
{
    UINT status;
    ULONG events = 0;

    printf("\r\nInitializing SNTP time sync\r\n");

    // Run the client
    status = sntp_client_run();

    // Wait for new events
    events = 0;
    tx_event_flags_get(&sntp_flags, SNTP_UPDATE_EVENT, TX_OR_CLEAR, &events, SNTP_WAIT_TIME);

    if (events & SNTP_UPDATE_EVENT)
    {
        // Time update event occurred
        status = NX_SUCCESS;
    }

    return status;
}
