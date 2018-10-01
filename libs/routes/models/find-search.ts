import { SearchQuery, FindQueryParams, FindQueryResponse } from "@elizer/shared";
import { RxCollection, RxQuery, RxDocument } from "rxdb";

/** default find curor sorting */
export const fQD: FindQueryParams = {
  limit: 15,
  skip: 0,
  sort: "id"
};

/** excutes oridinary find for the user */
export async function findDocs<T>(
    koll: RxCollection<T>,
    queryObj: object,
    custom: Partial<FindQueryParams> = {}
  ): Promise<Partial<FindQueryResponse<T>>> {
    const query = koll.find(queryObj);
    const total = await countQuery<T>(query);
    const data = await findQuery<T>(query, { ...fQD, ...custom } as any);
    return {
      data,
      total,
      limit: fQD.limit,
      skip: fQD.skip,
    };
  }

 /** excuetes find query and skip curosor defination */ 
async function findQuery<T>(
  query: RxQuery<T, RxDocument<T, {}>[]>,
  custom: FindQueryParams
) {
  return await query
    .sort(custom.sort)
    .skip(custom.skip)
    .limit(custom.limit)
    .exec()
    .then(e => e.map(e => e.toJSON()));
}

/** retrieves the total of document that matches the query */
async function countQuery<T>(query: RxQuery<T, RxDocument<T, {}>[]>) {
  return await query.exec().then(e => e.length);
}


/** excutes search which is a find for all documents mapped for search query */
export async function searchDocs<T>(
  koll: RxCollection<T>,
  queryObj: SearchQuery<T>,
  ctm: Partial<FindQueryParams> = {}
): Promise<Partial<FindQueryResponse<T>>> {
  const { $search, ...others } = queryObj as any;
  const docs = await koll
    .find(others || {})
    .exec()
    .then(res => res.map(doc => doc.toJSON()));
  return await searchAndCountQuery($search, docs, ctm);
}

/** search and count query that matches the query by doing a deep search */
function searchAndCountQuery<T>(
  query: string,
  docs: T[],
  ctm: Partial<FindQueryParams> = {}
) {
  const regx = new RegExp(`${query}`, "i");
  const skip = ctm.skip || fQD.skip;
  const limit = ctm.limit || fQD.limit;
  const filterdDocs = docs.filter(doc => {
    const values = Object.values(doc)
      .filter(e => e)
      .map(v => regx.test(v.toString().toLowerCase()));
    return values.includes(true);
  });
  const data = filterdDocs.slice(skip, skip + limit);
  return {
    data,
    skip,
    limit,
    total: filterdDocs.length,
  };
}
