package com.example.Spring_demo.controller;

import com.example.Spring_demo.util.InvalidatedTokenStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/auth")
public class LogoutController {

    private static final Logger logger = Logger.getLogger(LogoutController.class.getName());

    @Autowired
    private InvalidatedTokenStore invalidatedTokenStore;

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        logger.info("Received logout request with token: " + token);

        if (token == null || !token.startsWith("Bearer ")) {
            logger.warning("Token is missing or invalid");
            Map<String, String> response = new HashMap<>();
            response.put("message", "Token is missing or invalid");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Remove "Bearer " prefix
        token = token.substring(7);
        logger.info("Processed token: " + token);

        // Invalidate the token
        invalidatedTokenStore.invalidateToken(token);
        logger.info("Token invalidated: " + token);

        // Return a success response
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}