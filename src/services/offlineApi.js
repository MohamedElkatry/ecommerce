const offlineMessage = "No server is connected.";

function ok(body) {
  return Promise.resolve({ data: body });
}

function fail() {
  const error = new Error(offlineMessage);
  error.response = { data: { message: offlineMessage } };
  return Promise.reject(error);
}

export function offlineGet(url) {
  if (url.includes("/orders/user/")) {
    return ok([]);
  }

  if (url.includes("/cart")) {
    return ok({
      cartId: null,
      numOfCartItems: 0,
      data: { products: [], totalCartPrice: 0 },
    });
  }

  if (/\/(products|brands|categories)\/\d+$/.test(url)) {
    return ok({ data: null });
  }

  return ok({ data: [] });
}

export function offlinePost() {
  return fail();
}

export function offlinePut() {
  return fail();
}

export function offlineDelete() {
  return fail();
}
