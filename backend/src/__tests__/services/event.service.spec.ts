import { PrismaClient } from "@prisma/client";
import { EventService } from "../../services/event.service";
import { v4 as uuidv4 } from "uuid";
import { Event } from "../../interfaces/Event";
import { after } from "node:test";

// Mock the PrismaClient
const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockDelete = jest.fn();
const mockUpdate = jest.fn();
const mockEventPromotionFindUnique = jest.fn();
const mockEventPromotionUpdate = jest.fn();
const mockAllEventPromotion = jest.fn();

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      event: {
        create: mockCreate,
        findMany: mockFindMany,
        findUnique: mockFindUnique,
        delete: mockDelete,
        update: mockUpdate,
      },
      eventPromotion: {
        create: mockCreate,
        update: mockEventPromotionUpdate,
        mockEventPromotionUpdate,
        findUnique: mockEventPromotionFindUnique,
        findMany: mockAllEventPromotion,
      },
      $disconnect: jest.fn(),
    })),
  };
});

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("EventService", () => {
  let eventService: EventService;
  let consoleErrorSpy: jest.SpyInstance;

  // Mock data to be used in tests
  const mockEvent: Event = {
    id: "mocked-uuid",
    name: "Test Event",
    image: "test.jpg",
    description: "Test description",
    date: "2022-01-01",
    location: "Test Location",
    eventTime: "12:00",
    createdById: "creator_id",
    singleTickets: [{ id: "mocked-uuid", slots: 10, price: 20 }],
    groupTickets: [{ id: "mocked-uuid", slots: 5, price: 100, groupSize: 4 }],
  };

  const mockEvents: Event[] = [
    {
      id: "mocked-uuid-1",
      name: "Test Event 1",
      image: "test1.jpg",
      description: "Test description 1",
      date: "2022-01-01",
      location: "Test Location 1",
      eventTime: "2022-01-01T12:00:00Z",
      createdById: "creator_id_1",
      singleTickets: [{ id: "mocked-uuid-1", slots: 10, price: 20 }],
      groupTickets: [
        { id: "mocked-uuid-1", slots: 5, price: 100, groupSize: 4 },
      ],
    },
    {
      id: "mocked-uuid-2",
      name: "Test Event 2",
      image: "test2.jpg",
      description: "Test description 2",
      date: "2022-02-01",
      location: "Test Location 2",
      eventTime: "2022-02-01T14:00:00Z",
      createdById: "creator_id_2",
      singleTickets: [{ id: "mocked-uuid-2", slots: 15, price: 25 }],
      groupTickets: [
        { id: "mocked-uuid-2", slots: 10, price: 150, groupSize: 6 },
      ],
    },
  ];
  const updatedEvent: Event = {
    ...mockEvent,
    name: "Updated Event",
    description: "Updated description",
  };

  const updatedEventWithTickets: Event = {
    ...updatedEvent,
    singleTickets: [
      { id: "mocked-uuid", slots: 15, price: 25 },
      { id: "", slots: 5, price: 30 },
    ],
    groupTickets: [
      { id: "mocked-uuid", slots: 7, price: 120, groupSize: 5 },
      { id: "", slots: 8, price: 150, groupSize: 6 },
    ],
  };

  beforeEach(() => {
    eventService = new EventService();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (uuidv4 as jest.Mock).mockReturnValue("mocked-uuid");
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it("should create an event successfully", async () => {
    const expectedCreatedEvent = { ...mockEvent };

    mockCreate.mockResolvedValue(expectedCreatedEvent);

    const result = await eventService.createEvent(mockEvent);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        id: "mocked-uuid",
        name: mockEvent.name,
        image: mockEvent.image,
        description: mockEvent.description,
        date: mockEvent.date,
        location: mockEvent.location,
        eventTime: mockEvent.eventTime,
        createdBy: { connect: { id: mockEvent.createdById } },
        singleTickets: {
          createMany: {
            data: [{ id: "mocked-uuid", slots: 10, price: 20 }],
          },
        },
        groupTickets: {
          createMany: {
            data: [{ id: "mocked-uuid", slots: 5, price: 100, groupSize: 4 }],
          },
        },
      },
      include: {
        singleTickets: true,
        groupTickets: true,
      },
    });

    expect(result).toEqual({
      success: true,
      message: "Event created successfully",
      data: expectedCreatedEvent,
    });
  });

  it("should get all events successfully", async () => {
    mockFindMany.mockResolvedValue(mockEvents);

    const result = await eventService.getAllEvents();

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        isDeleted: false,
      },
      include: {
        singleTickets: true,
        groupTickets: true,
      },
    });

    expect(result).toEqual({
      success: true,
      message: "Events retrieved successfully",
      data: mockEvents,
    });
  });

  it("should handle errors when getting events", async () => {
    const error = new Error("Database error");
    mockFindMany.mockRejectedValue(error);

    const result = await eventService.getAllEvents();

    expect(result).toEqual({
      success: false,
      message: "An error occurred while getting events",
      data: null,
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting events:",
      error
    );
  });

  it("should get an event by ID successfully", async () => {
    mockFindUnique.mockResolvedValue(mockEvent);

    const result = await eventService.getEventById("mocked-uuid");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: {
        id: "mocked-uuid",
      },
      include: {
        singleTickets: true,
        groupTickets: true,
      },
    });

    expect(result).toEqual({
      success: true,
      message: "Event retrieved successfully",
      data: mockEvent,
    });
  });
  //gettting event by id
  it("events retrived successfully by planner", async () => {
    mockFindUnique.mockResolvedValue(mockEvent);

    const result = await eventService.getEventById("mocked-uuid");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: {
        id: "mocked-uuid",
      },
      include: {
        singleTickets: true,
        groupTickets: true,
      },
    });

    expect(result).toEqual({
      success: true,
      message: "Event retrieved successfully",
      data: mockEvent,
    });
  });
  it("should update an event successfully", async () => {
    // Mock current event data
    mockFindUnique.mockResolvedValue(mockEvent);

    // Mock update response
    mockUpdate.mockResolvedValue(updatedEventWithTickets);

    // Call updateEvent
    const result = await eventService.updateEvent("mocked-uuid", updatedEvent);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "mocked-uuid" },
      include: {
        singleTickets: true,
        groupTickets: true,
      },
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "mocked-uuid" },
      data: {
        name: updatedEvent.name,
        image: updatedEvent.image,
        description: updatedEvent.description,
        date: updatedEvent.date,
        location: updatedEvent.location,
        eventTime: updatedEvent.eventTime,
        singleTickets: {
          create: [],
          updateMany: [
            {
              where: { id: "mocked-uuid" },
              data: { slots: 10, price: 20 },
            },
          ],
          deleteMany: {
            id: {
              in: [],
            },
          },
        },
        groupTickets: {
          create: [],
          updateMany: [
            {
              where: { id: "mocked-uuid" },
              data: { slots: 5, price: 100, groupSize: 4 },
            },
          ],
          deleteMany: {
            id: {
              in: [],
            },
          },
        },
      },
      include: {
        singleTickets: true,
        groupTickets: true,
      },
    });

    expect(result).toEqual({
      success: true,
      message: "Event updated successfully",
      data: updatedEventWithTickets,
    });
  });

  it("should handle errors when updating an event", async () => {
    const error = new Error("Database error");
    mockFindUnique.mockResolvedValue(mockEvent);
    mockUpdate.mockRejectedValue(error);

    const result = await eventService.updateEvent("mocked-uuid", updatedEvent);

    expect(result).toEqual({
      success: false,
      message: "Database error",
      data: null,
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error updating event:",
      error
    );
  });

  it("should handle case when event to update is not found", async () => {
    const error = new Error("Event not found");
    mockFindUnique.mockResolvedValue(null);

    const result = await eventService.updateEvent("mocked-uuid", updatedEvent);

    expect(result).toEqual({
      success: false,
      message: "Event not found",
      data: null,
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error updating event:",
      error
    );
  });

  describe("requestEventPromotion", () => {
    const mockPromotionRequest = {
      id: "promotion-id",
      eventId: "mocked-uuid",
      requestedById: "user_id",
    };

    it("should create a promotion request successfully", async () => {
      mockFindUnique.mockResolvedValue(mockEvent);
      mockCreate.mockResolvedValue(mockPromotionRequest);

      const result = await eventService.requestEventPromotion(
        "mocked-uuid",
        "user_id"
      );

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: "mocked-uuid" },
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          id: "promotion-id",
          event: { connect: { id: "mocked-uuid" } },
          requestedBy: { connect: { id: "user_id" } },
        },
      });

      expect(result).toEqual({
        success: true,
        message:
          "Event promotion requested successfully. Waiting for admin approval.",
        data: mockPromotionRequest,
      });
    });

    it("should handle case when event is not found", async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await eventService.requestEventPromotion(
        "non-existent-event",
        "user_id"
      );

      expect(result).toEqual({
        success: false,
        message: "Event not found",
        data: null,
      });

      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("should handle errors when creating a promotion request", async () => {
      mockFindUnique.mockResolvedValue(mockEvent);
      const error = new Error("Database error");
      mockCreate.mockRejectedValue(error);

      const result = await eventService.requestEventPromotion(
        "mocked-uuid",
        "user_id"
      );

      expect(result).toEqual({
        success: false,
        message: "An error occurred while requesting event promotion",
        data: null,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error requesting event promotion:",
        error
      );
    });
  });

  describe("approveEventPromotionById", () => {
    const mockPromotion = {
      id: "promotion-id",
      eventId: "event-id",
      requestedById: "user-id",
      isApproved: false,
    };
    const mockUpdatedPromotion = {
      ...mockPromotion,
      isApproved: true,
    };

    beforeEach(() => {
      mockEventPromotionFindUnique.mockClear();
      mockEventPromotionUpdate.mockClear();
    });

    it("should approve event promotion successfully", async () => {
      mockEventPromotionFindUnique.mockResolvedValue(mockPromotion);
      mockEventPromotionUpdate.mockResolvedValue(mockUpdatedPromotion);

      const result = await eventService.approveEventPromotionById(
        "promotion-id"
      );

      expect(mockEventPromotionFindUnique).toHaveBeenCalledWith({
        where: { id: "promotion-id" },
      });

      expect(mockEventPromotionUpdate).toHaveBeenCalledWith({
        where: { id: "promotion-id" },
        data: { isApproved: true }, // No change needed here, as the update function expects this
      });

      expect(result).toEqual({
        success: true,
        message: "Event promotion request approved successfully",
        data: mockUpdatedPromotion,
      });
    });

    it("should handle non-existent promotion request", async () => {
      mockEventPromotionFindUnique.mockResolvedValue(null);

      const result = await eventService.approveEventPromotionById(
        "non-existent-id"
      );

      expect(mockEventPromotionFindUnique).toHaveBeenCalledWith({
        where: { id: "non-existent-id" },
      });

      expect(mockEventPromotionUpdate).not.toHaveBeenCalled();

      expect(result).toEqual({
        success: false,
        message: "Event promotion request not found",
        data: null,
      });
    });

    it("should handle database errors", async () => {
      const error = new Error("Database error");
      mockEventPromotionFindUnique.mockRejectedValue(error);

      const result = await eventService.approveEventPromotionById(
        "promotion-id"
      );

      expect(mockEventPromotionFindUnique).toHaveBeenCalledWith({
        where: { id: "promotion-id" },
      });

      expect(result).toEqual({
        success: false,
        message: "An error occurred while approving event promotion",
        data: null,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error approving event promotion:",
        error
      );
    });
  });

  describe("getAllEventPromotions", () => {
    const mockPromotions = [
      {
        id: "promotion-id-1",
        eventId: "event-id-1",
        requestedById: "user-id-1",
        isApproved: false,
        event: { id: "event-id-1", name: "Event 1" },
        requestedBy: { id: "user-id-1", name: "User 1" },
      },
      {
        id: "promotion-id-2",
        eventId: "event-id-2",
        requestedById: "user-id-2",
        isApproved: true,
        event: { id: "event-id-2", name: "Event 2" },
        requestedBy: { id: "user-id-2", name: "User 2" },
      },
    ];
    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
    });
    afterEach(() => {
      jest.clearAllMocks();
      consoleErrorSpy.mockRestore();
    });

    it("should retrieve all event promotions successfully", async () => {
      mockAllEventPromotion.mockResolvedValue(mockPromotions);

      const result = await eventService.getAllEventPromotions();

      expect(mockAllEventPromotion).toHaveBeenCalledWith({
        include: {
          event: true,
          requestedBy: true,
        },
      });

      expect(result).toEqual({
        success: true,
        message: "Event promotions retrieved successfully",
        data: mockPromotions,
      });
    });

    it("should retrieve all approved event promotions successfully", async () => {
      mockAllEventPromotion.mockResolvedValue(mockPromotions);

      const result = await eventService.getAllApprovedEventPromotions();

      expect(mockAllEventPromotion).toHaveBeenCalledWith({
        where: { isApproved: true },
        include: {
          event: true,
          requestedBy: true,
        },
      });

      expect(result).toEqual({
        success: true,
        message: "Approved event promotions retrieved successfully",
        data: mockPromotions,
      });
    });
    it("should get all event promotions successfully", async () => {
      mockAllEventPromotion.mockResolvedValue(mockPromotions);
      const result = await eventService.getAllEventPromotions();
      expect(mockAllEventPromotion).toHaveBeenCalledWith({
        include: {
          event: true,
          requestedBy: true,
        },
      });

      expect(result).toEqual({
        success: true,
        message: "Event promotions retrieved successfully",
        data: mockPromotions,
      });
    });
    it("should handle errors when retrieving event promotions", async () => {
      const error = new Error("Database error");
      mockAllEventPromotion.mockRejectedValue(error);

      const result = await eventService.getAllEventPromotions();

      expect(result).toEqual({
        success: false,
        message: "An error occurred while getting event promotions",
        data: null,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting event promotions:",
        error
      );
    });

    it("should disconnect Prisma client", async () => {
      const disconnectSpy = jest.spyOn(eventService["prisma"], "$disconnect");
      mockAllEventPromotion.mockResolvedValue(mockPromotions);

      await eventService.getAllEventPromotions();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});
