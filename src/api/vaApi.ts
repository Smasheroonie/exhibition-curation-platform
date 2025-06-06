// https://developers.vam.ac.uk/guide/v2/filter/introduction.html

type vaParams = {
  searchTerm: string;
  page: number;
  orderParam: "date" | "location" | "artist" | "place";
  sortParam: "asc" | "desc";
};

export async function fetchVAArtworks(
  searchTerm = "vinci",
  page = 1,
  orderParam = "date",
  sortParam = "desc",
) {
  const res = await fetch(
    `https://api.vam.ac.uk/v2/objects/search?q=${searchTerm}&page_size=20&page=${page}&order_by=${orderParam}&order_sort=${sortParam}&images_exist=1`,
  );

  return await res.json();
}
