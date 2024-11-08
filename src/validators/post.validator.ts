import Joi from "joi";

/**
 * Validation schema for post-related operations.
 * @typedef {Object} postSchema
 */
const postSchema = Joi.object({

  /**
   * Schema for the title of the post.
   * @property {string} title - The title of the post. Must be at least 5 characters long.
   * @property {string} content - The content of the post. Must be at least 1 character long.
   * @property {Array<string>} tags - An array of tags associated with the post. 
   *   The array should contain between 2 and 4 tags.
   */
  title: Joi.string().min(5).required(),
  content: Joi.string().min(1).required(),
  tags: Joi.array().items(Joi.string()).min(2).max(4).required(),
});

export default postSchema;
