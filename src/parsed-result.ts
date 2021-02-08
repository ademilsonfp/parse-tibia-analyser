
import {
  TypeParserKey,
  DefaultTypeParsers,
  CustomTypeParsers,
  KnownParsedValue
} from './type-parser';

export type ParsedModelTypeKey = TypeParserKey | 'raw';

export type ParsedModel<TypeParsers extends CustomTypeParsers> = {
  [FieldKey in string]: ParsedModelTypeKey | ParsedModel<TypeParsers>
};

export type ParsedResultValue<
  TypeKey extends ParsedModelTypeKey,
  TypeParsers extends CustomTypeParsers<Exclude<TypeKey, 'raw'>>
> = (
  TypeKey extends 'raw' ? string : (
    TypeKey extends keyof TypeParsers ? (
      ReturnType<TypeParsers[Exclude<TypeKey, 'raw'>]> extends (
        KnownParsedValue
      ) ?
      ReturnType<TypeParsers[Exclude<TypeKey, 'raw'>]> :
      ReturnType<DefaultTypeParsers[Exclude<TypeKey, 'raw'>]>
    ) :
    ReturnType<DefaultTypeParsers[Exclude<TypeKey, 'raw'>]>
  )
);

export type ParsedResultObject<
  TypeParsers extends CustomTypeParsers,
  Model extends ParsedModel<TypeParsers>
> = Readonly<{
  [FieldKey in keyof Model]: (
    Model[FieldKey] extends ParsedModelTypeKey ?
    ParsedResultValue<
      Exclude<Model[FieldKey], ParsedModel<TypeParsers>>,
      TypeParsers
    > :
    ParsedResultObject<
      TypeParsers,
      Exclude<Model[FieldKey], ParsedModelTypeKey>
    >
  )
}>;
