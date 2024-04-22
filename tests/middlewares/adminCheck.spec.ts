import { Request, Response } from "express";

import { UserRole } from "../../src/misc/types/User";
import adminCheck from "../../src/middlewares/adminCheck";
import { UserDocument } from "../../src/model/UserModel";

let mockNext = jest.fn();

describe('admincCheck middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnValue('You do not have permission.'),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() if user is an admin', () => {
    mockRequest.user = { role: UserRole.Admin } as UserDocument;
  
    adminCheck(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});