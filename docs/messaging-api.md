# Messaging API — Frontend Integration Guide

> **Base URL (REST):** `https://your-api.com/api/v1/messages`
> **WebSocket URL:** `wss://your-api.com` (Socket.IO)

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [REST Endpoints](#2-rest-endpoints)
3. [WebSocket Events](#3-websocket-events)
4. [Message Delivery State Machine](#4-message-delivery-state-machine)
5. [Online & Last Seen](#5-online--last-seen)
6. [Typing Indicators](#6-typing-indicators)
7. [Pagination Strategy](#7-pagination-strategy)
8. [Error Handling](#8-error-handling)
9. [Quick-Start Example (React)](#9-quick-start-example-react)

---

## 1. Authentication

### REST
Send a Bearer token in every request:
```
Authorization: Bearer <jwt_token>
```

### Socket.IO
Pass the token in the `auth` field when connecting:

```js
import { io } from 'socket.io-client';

const socket = io('https://your-api.com', {
  auth: { token: '<jwt_token>' },
  transports: ['websocket'],
});
```

If the token is missing or invalid the server will immediately close the connection and emit an `connect_error` event.

---

## 2. REST Endpoints

### 2.1 Start or retrieve a 1-to-1 conversation

```
POST /api/v1/messages/conversations
```

**Request body:**
```json
{
  "other_user_id": "uuid-of-the-other-user"
}
```

**Response `200` (conversation already exists) / `201` (newly created):**
```json
{
  "success": true,
  "data": {
    "isNew": false,
    "conversation": {
      "id": "conv-uuid",
      "other_user": {
        "id": "uuid",
        "name": "Riya Sharma",
        "profile_picture_url": "https://...",
        "last_seen_at": "2026-04-10T10:00:00Z"
      },
      "unread_count": 3,
      "muted": false,
      "last_message_at": "2026-04-10T10:05:00Z",
      "status": "active",
      "created_at": "2026-04-01T08:00:00Z"
    }
  }
}
```

> **Usage:** Call this endpoint when a user taps "Message" on another user's profile. Use the returned `conversation.id` for all subsequent operations.

---

### 2.2 List all conversations

```
GET /api/v1/messages/conversations
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "conv-uuid",
      "other_user": {
        "id": "uuid",
        "name": "Riya Sharma",
        "profile_picture_url": "https://...",
        "last_seen_at": "2026-04-10T10:00:00Z"
      },
      "unread_count": 2,
      "muted": false,
      "last_message_at": "2026-04-10T10:05:00Z",
      "last_message": {
        "id": "msg-uuid",
        "content": "Hey! Are you still looking?",
        "message_type": "text",
        "sender_id": "uuid",
        "delivery_status": "seen",
        "created_at": "2026-04-10T10:05:00Z",
        "is_mine": false
      },
      "status": "active",
      "created_at": "2026-04-01T08:00:00Z"
    }
  ]
}
```

> **Usage:** Populate the chat list screen. Sort by `last_message_at` (already done server-side). Show `unread_count` badge.

---

### 2.3 Get messages (paginated)

```
GET /api/v1/messages/conversations/:conversationId
GET /api/v1/messages/conversations/:conversationId?cursor=<message-id>
```

**Query params:**

| Param | Type | Description |
|---|---|---|
| `cursor` | UUID (optional) | ID of the last loaded message. Omit for the first page. |

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-uuid",
        "conversation_id": "conv-uuid",
        "sender": {
          "id": "uuid",
          "name": "Riya Sharma",
          "profile_picture_url": "https://..."
        },
        "content": "Hey! Are you still looking?",
        "message_type": "text",
        "media_url": null,
        "delivery_status": "seen",
        "reply_to": null,
        "created_at": "2026-04-10T10:05:00Z",
        "updated_at": "2026-04-10T10:06:00Z"
      }
    ],
    "nextCursor": "msg-uuid-of-last-item-or-null",
    "hasMore": true
  }
}
```

> **Messages are returned newest-first.** Reverse the array before rendering to display oldest at the top.

---

### 2.4 Mark conversation as read (REST fallback)

```
POST /api/v1/messages/conversations/:conversationId/read
```

No request body required.

**Response:**
```json
{ "success": true, "data": { "success": true } }
```

> Use the `mark_read` **socket event** while the chat screen is open. Use this REST endpoint as a fallback (e.g., when the user backgrounds the app then returns).

---

### 2.5 Archive conversation

```
DELETE /api/v1/messages/conversations/:conversationId
```

Soft-deletes the conversation **for the requesting user only** (the other user still sees it).

```json
{ "success": true, "data": { "archived": true } }
```

---

### 2.6 Get user presence (last seen — REST)

```
GET /api/v1/messages/presence/:userId
```

```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "last_seen_at": "2026-04-10T10:00:00Z"
  }
}
```

> Real-time online/offline state is pushed via the `user_online` socket event. Use this endpoint only for the initial render or when socket is unavailable.

---

## 3. WebSocket Events

### Connection

```js
const socket = io('https://your-api.com', {
  auth: { token: localStorage.getItem('accessToken') },
  transports: ['websocket'],
});

socket.on('connect', () => console.log('Connected!'));
socket.on('connect_error', (err) => console.error('Socket auth failed:', err.message));
```

---

### 3.1 Join a conversation (open the chat screen)

**Emit (client → server):**
```js
socket.emit('join_conversation', { conversationId: 'conv-uuid' });
```

**Receive confirmation:**
```js
socket.on('joined_conversation', ({ conversationId }) => {
  // You're now in the conversation room — you'll receive real-time messages
});
```

---

### 3.2 Leave a conversation (close the chat screen)

**Emit:**
```js
socket.emit('leave_conversation', { conversationId: 'conv-uuid' });
```

---

### 3.3 Send a message

**Emit:**
```js
socket.emit('send_message', {
  conversationId: 'conv-uuid',
  content: 'Hey! Is the room still available?',
  messageType: 'text',        // 'text' | 'image' | 'video' | 'audio'
  mediaUrl: null,             // URL (from Cloudinary) if messageType != 'text'
  replyToId: null,            // Message ID being replied to (optional)
  tempId: 'local-temp-id-1'  // Your local optimistic message ID
});
```

**Receive acknowledgement (your own socket — replaces optimistic copy):**
```js
socket.on('message_sent', ({ tempId, message }) => {
  // message = full formatted message with real ID from DB
  // Use tempId to find and replace the optimistic copy in your local state
});
```

**Other participant receives:**
```js
socket.on('new_message', ({ message }) => {
  // Same message shape as message_sent
  // Append to the conversation's message list
  // Update the conversation list preview
});
```

#### Message shape

```ts
interface Message {
  id: string;
  conversation_id: string;
  sender: {
    id: string;
    name: string;
    profile_picture_url: string | null;
  };
  content: string | null;
  message_type: 'text' | 'image' | 'video' | 'audio';
  media_url: string | null;
  delivery_status: 'sent' | 'delivered' | 'seen';
  reply_to: {
    id: string;
    content: string | null;
    message_type: string;
    sender: { id: string; name: string };
  } | null;
  created_at: string; // ISO 8601
  updated_at: string;
}
```

---

### 3.4 Message delivered

The server emits this **to the sender** when the recipient comes online (or is already online):

```js
socket.on('message_delivered', ({ messageId, conversationId, deliveredAt }) => {
  // Update the delivery_status of messageId to 'delivered'
  // Show double grey tick (✓✓)
});
```

---

### 3.5 Message seen

The server emits this **to the sender(s)** when the recipient calls `mark_read`:

```js
socket.on('message_seen', ({ conversationId, seenBy, seenAt }) => {
  // Update all messages in this conversation that are yours to 'seen'
  // Show double blue tick (✓✓ blue)
});
```

---

### 3.6 Mark as read (while chat screen is open)

**Emit** whenever the user opens or focuses the chat screen:

```js
socket.emit('mark_read', { conversationId: 'conv-uuid' });
```

The server will:
1. Set `delivery_status = 'seen'` on all unread messages
2. Reset your `unread_count` to 0
3. Emit `message_seen` to the original senders

---

### 3.7 Typing indicators

**Start typing:**
```js
socket.emit('typing_start', { conversationId: 'conv-uuid' });
```

**Stop typing (debounced — fire after ~1 s of inactivity):**
```js
socket.emit('typing_stop', { conversationId: 'conv-uuid' });
```

**Other participant receives:**
```js
socket.on('typing', ({ conversationId, userId, isTyping }) => {
  if (isTyping) {
    // Show "Riya is typing..." indicator
  } else {
    // Hide typing indicator
  }
});
```

> **Tip:** Debounce `typing_stop` on the client side — emit it 1–1.5 seconds after the user stops pressing keys.

---

### 3.8 Conversation list updated

The server emits this to the **recipient's user room** after a new message arrives, so the conversation list can be updated without a full reload:

```js
socket.on('conversation_updated', ({ conversationId, last_message }) => {
  // Find the conversation in your list by conversationId
  // Update last_message, last_message_at
  // Move conversation to the top of the list
  // Increment unread_count if the chat screen is not currently open
});
```

---

## 4. Message Delivery State Machine

```
[Sender sends]
       │
       ▼
    ┌──────┐
    │ sent │  ← one grey tick (✓)
    └──┬───┘
       │  recipient comes online / joins conversation
       ▼
 ┌───────────┐
 │ delivered │  ← two grey ticks (✓✓)
 └─────┬─────┘
       │  recipient calls mark_read / opens chat
       ▼
  ┌────────┐
  │  seen  │  ← two blue ticks (✓✓ blue)
  └────────┘
```

**How to display:**
| Status | Icon | Example |
|---|---|---|
| `sent` | Single grey tick | ✓ |
| `delivered` | Double grey tick | ✓✓ |
| `seen` | Double blue tick | ✓✓ (blue) |

---

## 5. Online & Last Seen

### Real-time

```js
socket.on('user_online', ({ userId, isOnline, lastSeenAt }) => {
  if (isOnline) {
    // Show green dot, display "Online"
    // lastSeenAt will be null when isOnline is true
  } else {
    // Hide green dot
    // Display "Last seen <formatted lastSeenAt>"
  }
});
```

### Initial Render

On opening a chat screen, call the REST endpoint once to get the initial state:

```
GET /api/v1/messages/presence/:userId
```

Then listen to `user_online` for real-time updates.

### Displaying "Last seen"

```ts
function formatLastSeen(lastSeenAt: string | null): string {
  if (!lastSeenAt) return 'Online';
  const date = new Date(lastSeenAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'last seen just now';
  if (diffMins < 60) return `last seen ${diffMins} minutes ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `last seen ${diffHours} hours ago`;

  return `last seen on ${date.toLocaleDateString()}`;
}
```

---

## 6. Typing Indicators

### Recommended Implementation

```ts
let typingTimer: ReturnType<typeof setTimeout>;

function onKeyPress() {
  socket.emit('typing_start', { conversationId });

  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    socket.emit('typing_stop', { conversationId });
  }, 1500); // stop after 1.5 s of inactivity
}
```

---

## 7. Pagination Strategy

Use **cursor-based pagination** for the message history:

```ts
let nextCursor: string | null = null;
let hasMore = true;
let isLoading = false;

async function loadMoreMessages() {
  if (!hasMore || isLoading) return;
  isLoading = true;

  const url = nextCursor
    ? `/api/v1/messages/conversations/${conversationId}?cursor=${nextCursor}`
    : `/api/v1/messages/conversations/${conversationId}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const { data } = await res.json();

  // Messages come newest-first — prepend to your list
  messages = [...data.messages.reverse(), ...messages];
  nextCursor = data.nextCursor;
  hasMore = data.hasMore;
  isLoading = false;
}
```

- **First load:** call without `cursor` — gets the latest 30 messages.
- **Load older messages:** call with `cursor = nextCursor` when the user scrolls to the top.
- Each page returns up to **30 messages** newest-first. Reverse before display.

---

## 8. Error Handling

### REST Errors

All errors follow the shape:
```json
{ "success": false, "message": "Human-readable error message" }
```

| HTTP Code | Meaning |
|---|---|
| 400 | Bad request (missing fields, self-message) |
| 401 | Missing or invalid JWT |
| 404 | Conversation / user not found |
| 500 | Internal server error |

### Socket Errors

```js
socket.on('error', ({ message }) => {
  console.error('Socket error:', message);
  // Show toast / snackbar in UI
});

socket.on('connect_error', (err) => {
  // err.message = 'Authentication token missing' | 'Invalid or expired token'
  // Redirect to login if token expired
  if (err.message.includes('expired')) {
    redirectToLogin();
  }
});
```

---

## 9. Quick-Start Example (React)

```tsx
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API = 'https://your-api.com';

export function ChatScreen({ conversationId, token }) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [otherOnline, setOtherOnline] = useState(false);

  useEffect(() => {
    const socket = io(API, {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_conversation', { conversationId });
      socket.emit('mark_read', { conversationId });
    });

    socket.on('new_message', ({ message }) => {
      setMessages((prev) => [...prev, message]);
      socket.emit('mark_read', { conversationId });
    });

    socket.on('message_sent', ({ tempId, message }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? message : m))
      );
    });

    socket.on('message_delivered', ({ conversationId: cid }) => {
      if (cid === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.delivery_status === 'sent' ? { ...m, delivery_status: 'delivered' } : m
          )
        );
      }
    });

    socket.on('message_seen', ({ conversationId: cid }) => {
      if (cid === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            ['sent', 'delivered'].includes(m.delivery_status)
              ? { ...m, delivery_status: 'seen' }
              : m
          )
        );
      }
    });

    socket.on('typing', ({ isTyping }) => setTyping(isTyping));
    socket.on('user_online', ({ isOnline }) => setOtherOnline(isOnline));

    return () => {
      socket.emit('leave_conversation', { conversationId });
      socket.disconnect();
    };
  }, [conversationId, token]);

  function sendMessage(text: string) {
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      content: text,
      sender: { id: 'me' },
      delivery_status: 'sent',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    socketRef.current?.emit('send_message', {
      conversationId,
      content: text,
      messageType: 'text',
      tempId,
    });
  }

  return (
    <div>
      <p>{otherOnline ? '🟢 Online' : 'Offline'}</p>
      {typing && <p>typing...</p>}
      {messages.map((m) => (
        <div key={m.id}>{m.content} — {m.delivery_status}</div>
      ))}
    </div>
  );
}
```

---

## Summary of All Socket Events

| Direction | Event | Payload |
|---|---|---|
| Client → Server | `join_conversation` | `{ conversationId }` |
| Client → Server | `leave_conversation` | `{ conversationId }` |
| Client → Server | `send_message` | `{ conversationId, content?, messageType?, mediaUrl?, replyToId?, tempId? }` |
| Client → Server | `typing_start` | `{ conversationId }` |
| Client → Server | `typing_stop` | `{ conversationId }` |
| Client → Server | `mark_read` | `{ conversationId }` |
| Server → Client | `joined_conversation` | `{ conversationId }` |
| Server → Client | `new_message` | `{ message: Message }` |
| Server → Client | `message_sent` | `{ tempId, message: Message }` |
| Server → Client | `message_delivered` | `{ messageId?, conversationId, deliveredAt }` |
| Server → Client | `message_seen` | `{ conversationId, seenBy, seenAt }` |
| Server → Client | `typing` | `{ conversationId, userId, isTyping }` |
| Server → Client | `user_online` | `{ userId, isOnline, lastSeenAt }` |
| Server → Client | `conversation_updated` | `{ conversationId, last_message: Message }` |
| Server → Client | `error` | `{ message }` |
