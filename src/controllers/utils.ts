import Joi from 'joi';

export const onlyLatinValidator = Joi.string()
  .custom((value: any, helpers): string => {
    if (/^[a-zA-Z]+$/.test(value)){
      return value;
    }
    throw new Error('value must be only in latin letters');
  },
  'Only latin letters allowed',
  );
