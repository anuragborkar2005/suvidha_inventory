import { ApiResponse } from "../utils/ApiResponse.js";
export const healthCheck = (req, res) => {
    return res.json(new ApiResponse(200, null, "HealthCheck Successfull"));
};
//# sourceMappingURL=healthcheck.controller.js.map