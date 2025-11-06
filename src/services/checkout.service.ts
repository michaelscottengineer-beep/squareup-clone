type TCreateCheckoutSessionPayload = {
  line_items: {
    price_data: {
      currency: string;
      product_data: {
        name: string;
      };
      unit_amount: number; // Amount in cents
    };
    quantity: number;
  }[];
  orderId: string;
  shopId: string;
};

const checkoutService = {
  createCheckoutSession: async ({
    line_items,
    orderId,
    shopId,
  }: TCreateCheckoutSessionPayload) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BASE_URL + "/create-checkout-session",
        {
          method: "POST",
          body: JSON.stringify({
            line_items,
            orderId,
            shopId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return await res.json();
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

export default checkoutService;
