package com.buoi6.user.event;

public record EventEnvelope(String eventType, Object payload) {}
