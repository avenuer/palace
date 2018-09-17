import { EntityModelNames } from '@elizer/shared';
import { baseModel, CollectionConfig } from '../shared';

/** key to retrieve the collection form the db intialize object */

/**
 * subject record information and schema
 */
export const memberSchema = {
  title: 'Member Schema',
  version: 0,
  description: 'stores various members biodata',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    phoneNo: {
      type: 'string',
    },
    gender: {
      type: 'string',
    },
    day: {
      type: 'number',
      default: 'none',
    },
    month: {
      type: 'string',
      default: 'none',
    },
    isStudent: {
      type: 'boolean',
    },
    department: {
      type: 'string',
    },
    level: {
      type: 'string',
    },
    school: {
      type: 'string',
    },
    job: {
      type: 'string',
    },
    workAddress: {
      type: 'string',
    },
    isVisitor: {
      type: 'boolean',
    },
    address: {
      type: 'string',
    },
    churchNo: {
      type: 'number',
    },
    ...baseModel.schema,
  },
  required: [
    'name',
    'phoneNo',
    'gender',
    'address',
    'churchNo',
    ...baseModel.required,
  ],
};

export const memberModel: CollectionConfig<typeof memberSchema> = {
  name: EntityModelNames.Member,
  schema: memberSchema,
};
