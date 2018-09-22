import { EntityModelNames } from '@elizer/shared';
import { baseModel, CollectionConfig } from '../shared';

/** key to retrieve the collection form the db intialize object */

/**
 * subject record information and schema
 */
export const attendanceSchema = {
  title: 'attendance Schema',
  version: 0,
  description: 'stores various attendances',
  type: 'object',
  properties: {
    owner: {
      type: 'string',
      final: true,
    },
    date: {
      type: 'number',
    },
    attendance: {
      type: 'number',
    },
    ...baseModel.schema,
  },
  required: [
    'owner',
    'date',
    'attendance',
    ...baseModel.required,
  ],
};

export const attendanceModel: CollectionConfig<typeof attendanceSchema> = {
  name: EntityModelNames.Attendance,
  schema: attendanceSchema,
};
