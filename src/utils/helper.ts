export const parseSegments = (...segments: any[]) => {
  const cleaned = segments.map((s) => {
    // String(...) handles numbers, null, undefined, objects (calls toString)
    const seg = String(s ?? "");
    // remove leading OR trailing slashes (any number of them)
    return seg.replace(/^\/+|\/+$/g, "");
  });

  console.log(cleaned);
  return cleaned.join("/");
};

export function convertFirebaseArrayData<T>(data: { [id: string]: T }) {
  return Object.entries(data).map(([id, val]) => ({ ...val, id })) ?? [];
}
