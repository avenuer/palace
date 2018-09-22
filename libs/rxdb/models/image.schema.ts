import { EntityModelNames } from '@elizer/shared';
import { baseModel, CollectionConfig } from '../shared';

/** key to retrieve the collection form the db intialize object */

/**
 * subject record information and schema
 */
export const imageSchema = {
  title: 'image Schema',
  version: 0,
  description: 'stores various image',
  type: 'object',
  properties: {
    link: {
      type: 'string',
    },
    owner: {
      type: 'string',
    },
    ...baseModel.schema,
  },
  required: [
    'link',
    'owner',
    ...baseModel.required,
  ],
};

export const imageModel: CollectionConfig<typeof imageSchema> = {
  name: EntityModelNames.Image,
  schema: imageSchema,
};
