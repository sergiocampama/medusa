import { refetchEntities } from "@medusajs/framework/http"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const fetchCustomerGroupsStepId = "fetch-customer-groupsid"
export const fetchCustomerGroupsStep = createStep(
  fetchCustomerGroupsStepId,
  async (data: string | undefined, {container}) => {
    if (!!data) {
      const customerGroups = await refetchEntities(
        "customer_group",
        { customers: { id: data } },
        container,
        ["id"]
      )

      return new StepResponse({customer_group_ids: customerGroups.map((cg: any) => cg.id)})
    } else {
      return new StepResponse({customer_group_ids: []})
    }
  }
)
