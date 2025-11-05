export type TPaymentMethod = {
  id: string;
  object: "payment_method";
  billing_details: {
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      postal_code: string;
      state: string;
    };
    email: string;
    name: string;
    phone: string;
  };
  card: {
    brand: string;
    checks: {
      address_line1_check: string;
      address_postal_code_check: string;
      cvc_check: "pass";
    };
    country: "US";
    exp_month: 12;
    exp_year: 2034;
    fingerprint: "Xt5EWLLDS7FJjR1c";
    funding: "credit";
    generated_from: string;
    last4: "4242";
    networks: {
      available: ["visa"];
      preferred: string;
    };
    three_d_secure_usage: {
      supported: true;
    };
    wallet: string;
  };
  customer: string;
  livemode: false;
  redaction: string;
  type: "card";
};
