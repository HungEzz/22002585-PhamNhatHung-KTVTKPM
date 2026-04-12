package com.buoi6.user.event;

import java.time.Instant;

public record UserRegisteredPayload(
    String userId, String username, String email, Instant occurredAt) {}
