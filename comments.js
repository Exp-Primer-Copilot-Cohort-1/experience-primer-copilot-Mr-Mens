// Create web server 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Make requests to other services
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

// GET request to /posts/:id/comments
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

// POST request to /posts/:id/comments
app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex'); // Generate random id
    const { content } = req.body;

    // Retrieve comments for the post
    const comments = commentsByPostId[req.params.id] || [];

    // Push new comment to array
    comments.push({ id: commentId, content, status: 'pending' });

    // Store comments in object
    commentsByPostId[req.params.id] = comments;

    // Emit event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    });

    res.status(201).send(comments);
});

// POST request to /events
app.post('/events', async (req, res) => {
    console.log('Received event', req.body.type);

    const { type, data } = req.body;

    // Check if event type is CommentModerated
    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;

        // Retrieve comments for the post
        const comments = commentsByPostId[postId];

        // Find comment with matching id
        const comment = comments.find(comment => {
            return comment.id === id;
        });

        // Update status
        comment.status = status;

        // Emit event to event bus
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        });
    }

    res.send({});
});

//

