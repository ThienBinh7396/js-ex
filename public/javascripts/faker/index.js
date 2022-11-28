(() => {
  const API_BASE_URL = "http://localhost:3000/users";

  class FakeData {
    init() {
      return new Promise((resolve) => {
        fetch(API_BASE_URL)
          .then((res) => res.json())
          .then((res) => {
            resolve(res.data);
          })
          .catch(console.error);
      });
    }

    async get() {
      return this.init();
    }
  }

  window.FAKE_DATA = new FakeData();
  Object.freeze(window.FAKE_DATA);
})();
