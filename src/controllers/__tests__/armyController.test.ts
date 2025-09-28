import { ArmyController } from "../armyController.js";

describe("ArmyController", () => {
  let armyServiceMock: any;
  let controller: ArmyController;
  let res: any;
  let req: any;

  beforeEach(() => {
    armyServiceMock = {
      getAllArmies: jest.fn(),
      getArmyById: jest.fn(),
      createArmy: jest.fn(),
      updateArmy: jest.fn(),
      deleteArmy: jest.fn(),
      getArmiesByUser: jest.fn(),
    };

    controller = new ArmyController(armyServiceMock);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    req = {
      params: {},
      session: { userId: "myUser", role: "user" },
      validatedBody: {},
    };
  });

  it("getAllArmies", async () => {
    const armies = [{ id: "1", name: "myArmy" }];
    armyServiceMock.getAllArmies.mockResolvedValue(armies);

    await controller.getAllArmies(req, res);

    expect(armyServiceMock.getAllArmies).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(armies);
  });

  it("getAllArmies - error", async () => {
    armyServiceMock.getAllArmies.mockRejectedValue(new Error("Failure"));

    await controller.getAllArmies(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Failure" });
  });

  it("getArmyById - success", async () => {
    req.params.id = "1";
    const army = { id: "1", name: "myArmy" };
    armyServiceMock.getArmyById.mockResolvedValue(army);

    await controller.getArmyById(req, res);

    expect(armyServiceMock.getArmyById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(army);
  });

  it("getArmyById - not found", async () => {
    req.params.id = "1";
    armyServiceMock.getArmyById.mockResolvedValue(null);

    await controller.getArmyById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Army not found" });
  });

  it("getArmyById - error", async () => {
    req.params.id = "1";
    armyServiceMock.getArmyById.mockRejectedValue(new Error("Fail"));

    await controller.getArmyById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Fail" });
  });

  it("createArmy - success", async () => {
    req.validatedBody = { name: "Second Army" };
    req.session.userId = "myUser";

    const createdArmy = { id: "2", name: "Second Army" };
    armyServiceMock.createArmy.mockResolvedValue(createdArmy);

    await controller.createArmy(req, res);

    expect(armyServiceMock.createArmy).toHaveBeenCalledWith(
      "myUser",
      "Second Army"
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdArmy);
  });

  it("createArmy - error", async () => {
    req.validatedBody = { name: "mySecondArmy" };
    req.session.userId = "myUser";

    armyServiceMock.createArmy.mockRejectedValue(new Error("Fail"));

    await controller.createArmy(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Fail" });
  });

  it("updateArmy - success", async () => {
    req.params.id = "1";
    req.validatedBody = { name: "UpdatedArmy", resources: 1000 };
    req.session.userId = "myUser";

    const updatedArmy = { id: "1", name: "UpdatedArmy", resources: 1000 };
    armyServiceMock.updateArmy.mockResolvedValue(updatedArmy);

    await controller.updateArmy(req, res);

    expect(armyServiceMock.updateArmy).toHaveBeenCalledWith(
      "myUser",
      "1",
      req.validatedBody
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedArmy);
  });

  it("updateArmy - error", async () => {
    req.params.id = "1";
    req.validatedBody = { name: "UpdatedArmy", resources: 1000 };
    req.session.userId = "myUser";

    armyServiceMock.updateArmy.mockRejectedValue(new Error("Fail"));

    await controller.updateArmy(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Fail" });
  });

  it("deleteArmy - success", async () => {
    req.params.id = "1";
    req.session.userId = "myUser";

    armyServiceMock.deleteArmy.mockResolvedValue(true);

    await controller.deleteArmy(req, res);

    expect(armyServiceMock.deleteArmy).toHaveBeenCalledWith("myUser", "1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(true);
  });

  it("deleteArmy - error", async () => {
    req.params.id = "1";
    req.session.userId = "myUser";

    armyServiceMock.deleteArmy.mockRejectedValue(new Error("Fail"));

    await controller.deleteArmy(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Fail" });
  });

  it("getArmiesByUser - success if owner", async () => {
    req.params.userId = "myUser";
    req.session.userId = "myUser";

    const armies = [{ id: "1", name: "myArmy" }];
    armyServiceMock.getArmiesByUser.mockResolvedValue(armies);

    await controller.getArmiesByUser(req, res);

    expect(armyServiceMock.getArmiesByUser).toHaveBeenCalledWith("myUser");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(armies);
  });

  it("getArmiesByUser - forbidden for non-owner", async () => {
    req.params.userId = "user456";
    req.session.userId = "myUser";
    req.session.role = "user";

    await controller.getArmiesByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
  });

  it("getArmiesByUser - success for admin", async () => {
    req.params.userId = "user456";
    req.session.userId = "myUser";
    req.session.role = "admin";

    const armies = [{ id: "2", name: "mySecondArmy" }];
    armyServiceMock.getArmiesByUser.mockResolvedValue(armies);

    await controller.getArmiesByUser(req, res);

    expect(armyServiceMock.getArmiesByUser).toHaveBeenCalledWith("user456");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(armies);
  });

  it("getArmiesByUser - error", async () => {
    req.params.userId = "myUser";
    req.session.userId = "myUser";

    armyServiceMock.getArmiesByUser.mockRejectedValue(new Error("Fail"));

    await controller.getArmiesByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Fail" });
  });
});
