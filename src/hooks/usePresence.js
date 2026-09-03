import { useEffect, useState } from "react";
import apiClient from "../api/client";

/**
 * Prompt#1 5.2: Real-Time Status Tracking.
 *
 * NOTE: the frontend alone cannot provide true real-time presence — that
 * needs a backend with WebSockets or Firebase Realtime Database, which
 * isn't part of this repo. This hook implements the frontend half of that
 * contract so it lights up as soon as the backend adds the two endpoints
 * below, and degrades harmlessly (no crash, badges just stay gray) if they
 * don't exist yet:
 *   - POST /presence/heartbeat            { }      -> marks current user online
 *   - GET  /organizations/:orgId/presence          -> { [userId]: boolean }
 */
const HEARTBEAT_INTERVAL_MS = 20000;
const POLL_INTERVAL_MS = 15000;

// Call once near the app root (while a user is logged in) to keep this
// user's own status "online" while the tab is open and focused.
export function usePresenceHeartbeat(enabled) {
  useEffect(() => {
    if (!enabled) return;

    function sendHeartbeat() {
      if (document.visibilityState !== "visible") return;
      apiClient.post("/presence/heartbeat").catch(() => {
        /* backend may not implement this yet — fail silently */
      });
    }

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    document.addEventListener("visibilitychange", sendHeartbeat);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", sendHeartbeat);
    };
  }, [enabled]);
}

// Poll online/offline status for every member of an organization.
export function useOrgPresence(orgId) {
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    if (!orgId) return;
    let active = true;

    function poll() {
      apiClient
        .get(`/organizations/${orgId}/presence`)
        .then(({ data }) => active && setStatuses(data || {}))
        .catch(() => {
          /* backend may not implement this yet — badges stay gray */
        });
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orgId]);

  return statuses;
}
