import mongoose from 'mongoose';

const { Schema } = mongoose;

const SnippetSchema = new Schema(
    {
        language: { type: String, required: true, unique: true },
        snippets: [{
            name: { type: String, required: true },
            code: {
                type: Map,
                of: String,
                enum: ['html', 'css', 'js', 'requirements']
            }
        }]
    },
    { versionKey: false }
);

SnippetSchema.index({ language: 1, 'snippets.name': 1 }, { unique: true });

const Snippet = mongoose.model('Snippets', SnippetSchema);

export default Snippet;