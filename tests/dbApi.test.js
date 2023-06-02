import { createUser } from "@/lib/dbApi";

xtest("creates a user with the given info", async () => {
  expect(
    await createUser(
      "123",
      "123",
      "firstName",
      "k@k.com",
      "imageUrl",
      "youtubeID123"
    )
  ).tobe({});
});
