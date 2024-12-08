import { addToCartWorkflow } from "@medusajs/core-flows"
import { MedusaResponse, MedusaStoreRequest, refetchEntities } from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { refetchCart } from "../../helpers"
import { StoreAddCartLineItemType } from "../../validators"

export const POST = async (
  req: MedusaStoreRequest<StoreAddCartLineItemType>,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  const customerGroups = await refetchEntities(
    "customer_group",
    { customers: { id: req.auth_context?.actor_id } },
    req.scope,
    ["id"]
  )

  console.log(customerGroups)

  const workflowInput = {
    items: [req.validatedBody],
    cart,
  }

  await addToCartWorkflow(req.scope).run({
    input: workflowInput,
  } as any)

  const updatedCart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart: updatedCart })
}
