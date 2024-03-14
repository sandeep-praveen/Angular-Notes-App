/**
 * @swagger
 * tags:
 *   name: Snippets
 *   description: API endpoints for managing snippets
 */

import express from 'express';
import snippetController from '../controllers/snippetController.js'
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve all snippets
 *     tags: [Snippets]
 *     responses:
 *       200:
 *         description: Successful operation. Returns all snippets.
 *       500:
 *         description: Server Error.
 */
router.get('/', snippetController.getSnippets);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for snippets
 *     tags: [Snippets]
 *     parameters:
 *       - in: query
 *         name: snippets.name
 *         schema:
 *           type: string
 *         description: Name of the snippet to search for.
 *     responses:
 *       200:
 *         description: Successful operation. Returns matching snippets.
 *       500:
 *         description: Server Error.
 */
router.get('/search', snippetController.searchSnippet);

/**
 * @swagger
 * /authenticate:
 *   post:
 *     summary: Generate authentication token
 *     tags: [Snippets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful operation. Returns authentication token.
 *       401:
 *         description: Authentication failed.
 *       500:
 *         description: Server Error.
 */
router.post('/authenticate', snippetController.generateToken);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new snippet
 *     tags: [Snippets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Snippet'
 *     responses:
 *       201:
 *         description: Snippet created successfully.
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 */
router.post('/', verifyToken, snippetController.createSnippet);

/**
 * @swagger
 * /{languageId}:
 *   put:
 *     summary: Add a snippet to a language
 *     tags: [Snippets]
 *     parameters:
 *       - in: path
 *         name: languageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the language.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Snippet'
 *     responses:
 *       200:
 *         description: Snippet added successfully.
 *       400:
 *         description: Bad request - Invalid input, object invalid.
 *       401:
 *         description: Unauthorized - Invalid token.
 *       404:
 *         description: Not found - Language not found.
 *       500:
 *         description: Server Error.
 */
router.put('/:languageId', verifyToken, snippetController.addLanguageSnippet);

/**
 * @swagger
 * /{snippetId}:
 *   delete:
 *     summary: Delete a snippet
 *     tags: [Snippets]
 *     parameters:
 *       - in: path
 *         name: snippetId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the snippet.
 *     responses:
 *       200:
 *         description: Snippet deleted successfully.
 *       401:
 *         description: Unauthorized - Invalid token.
 *       404:
 *         description: Not found - Snippet not found.
 *       500:
 *         description: Server Error.
 */
router.delete('/:snippetId', verifyToken, snippetController.deleteSnippet);

export default router;
