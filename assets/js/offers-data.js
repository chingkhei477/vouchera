/*
  VOUCHERA — live offers
  ======================
  This is the ONLY file you edit to publish, change or remove offers.
  Offers appear automatically on the Home page ("Live offers") and on
  Explore Offers. Expired offers (validUntil in the past) hide themselves.

  Only add an offer once the store / affiliate network has confirmed the
  commission and terms in writing. Copy the rates and conditions exactly.

  Fields
  ------
  id           unique short id, letters/numbers/dashes          "store-fashion-01"
  store        store name as the store writes it                 "Store Name"
  category     one of: fashion, electronics, beauty, home, travel,
               food, books, gifts
  headline     one-line summary of the cashback                  "Up to 6% cashback on apparel"
  rate         the main rate shown on the voucher stub           "6%"   or "₹150"
  rateLabel    small text under the rate                         "max cashback"
  url          your tracked affiliate link (must start https://)
  tracksIn     when the purchase usually shows as Tracked        "Within 72 hours"
  confirmsIn   when the store usually confirms                   "60–90 days"
  eligibility  array of who / what qualifies
  conditions   array of rules and exclusions
  validUntil   last day of the offer, YYYY-MM-DD (or "" for ongoing)

  Example (copy the block inside the brackets, then fill in real details):

  {
    id: "",
    store: "",
    category: "fashion",
    headline: "",
    rate: "",
    rateLabel: "max cashback",
    url: "https://",
    tracksIn: "",
    confirmsIn: "",
    eligibility: [""],
    conditions: [""],
    validUntil: ""
  }
*/
window.VOUCHERA_OFFERS = [
];
