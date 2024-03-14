import Snippet from '../models/snippet.js';
import jwt from 'jsonwebtoken';

const snippetController = {

    generateToken: async (req, res) => {
        try {
            const { username, password } = req.body;
            if (username === 'sandy' && password === 'Test@1') {
                const token = jwt.sign({ username }, 'secret-key', { expiresIn: '1hr' });
                res.status(200).json({ message: 'Authentication success', token });
            } else {
                res.status(401).json({ message: 'Authentication failed' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    getSnippets: async (req, res) => {
        try {
            const snippets = await Snippet.find();
            res.status(200).json({ message: 'Snippets retrieved successfully', data: snippets });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    createSnippet: async (req, res) => {
        try {
            const newSnippet = new Snippet(req.body);
            const savedSnippet = await newSnippet.save();
            res.status(201).json({ message: 'Snippet created successfully', data: savedSnippet });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    addLanguageSnippet: async (req, res) => {
        try {
            const { languageId } = req.params;
            const { name, code } = req.body;

            const language = await Snippet.findById(languageId);
            if (!language) {
                return res.status(404).json({ message: 'Language not found' });
            }
            if (language.snippets.some(snippet => snippet.name === name)) {
                return res.status(400).json({ message: 'Snippet name must be unique within the language' });
            }

            language.snippets.push({ name, code });
            const updatedLanguage = await language.save();
            return res.status(200).json({ message: 'Snippet added successfully', data: updatedLanguage });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    deleteSnippet: async (req, res) => {
        try {
            const { snippetId } = req.params;
            const snippetDocument = await Snippet.findOne({ "snippets._id": snippetId });

            if (!snippetDocument) return res.status(404).json({ message: 'Snippet not found' });

            if (snippetDocument.snippets.length > 1) {
                const deletedSnippet = await Snippet.findOneAndUpdate(
                    { "snippets._id": snippetId },
                    { $pull: { snippets: { _id: snippetId } } },
                    { new: true }
                );
                return res.status(200).json({ message: 'Snippet deleted successfully', deletedSnippet });
            } else {
                await Snippet.findOneAndDelete({ "snippets._id": snippetId });
                return res.status(200).json({ message: 'Snippet and its document deleted successfully' });
            }

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    searchSnippet: async (req, res) => {
        try {
            const Snippets = await Snippet.find(req.query);
            const filteredData = Snippets.map(item => ({
                snippets: item.snippets.filter(snippet => snippet.name === req.query['snippets.name'])
            }));
            res.status(200).json({ message: 'Snippet retrieved successfully', data: filteredData });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    }
}

export default snippetController;