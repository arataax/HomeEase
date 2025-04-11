package com.homeease.dto;

import java.time.LocalDate;
import java.util.List;


public class AvailabilityResponse {
    private List<LocalDate> availableDates;
    private List<LocalDate> occupiedDates;

    // Constructor
    public AvailabilityResponse(List<LocalDate> availableDates, List<LocalDate> occupiedDates) {
        this.availableDates = availableDates;
        this.occupiedDates = occupiedDates;
    }

    public List<LocalDate> getAvailableDates() {
        return availableDates;
    }

    public void setAvailableDates(List<LocalDate> availableDates) {
        this.availableDates = availableDates;
    }

    public List<LocalDate> getOccupiedDates() {
        return occupiedDates;
    }

    public void setOccupiedDates(List<LocalDate> occupiedDates) {
        this.occupiedDates = occupiedDates;
    }
}