import { MemoryRouter } from "react-router-dom";
import { test, expect } from "vitest";
import App from "~/components/App/App";
import { server } from "~/mocks/server";
import { http, HttpResponse, delay } from "msw";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";
import { AvailableProduct } from "~/models/Product";
import { renderWithProviders } from "~/testUtils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { formatAsPrice } from "~/utils/utils";
import {products} from "~/mocks/data";


test("Renders products list", async () => {
  const products: AvailableProduct[] = [
    {
      id: "1",
      title: "Product 1",
      description: "Product 1 description",
      price: 1,
      count: 1,
      category: "Strategy",
      author: "Klaus Teuber",
      weight: 1.5,
      players: "3-4",
    },
    {
      id: "2",
      title: "Product 2",
      description: "Product 2 description",
      price: 2,
      count: 2,
      category: "Strategy",
      author: "Klaus Teuber",
      weight: 1.5,
      players: "3-4",
    },
  ];
  server.use(
    http.get(`${API_PATHS.bff}/product/available`, async() => {
        await delay();
        return HttpResponse.json(products);
    }),
    http.get(`${API_PATHS.cart}/profile/cart`, () => {
        return HttpResponse.json([]);
    })
  );
  renderWithProviders(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/Loading/));
  products.forEach((product) => {
    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(formatAsPrice(product.price))).toBeInTheDocument();
  });
});
