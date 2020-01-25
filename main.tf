resource "azurerm_resource_group" "project_cloud" {
  name     = "project_cloud"
  location = "francecentral"

  tags {
    Owner = "Souissi Mohamed"
  }
}

resource "azurerm_storage_account" "project_cloud" {
  name                     = "storagecloudx"
  resource_group_name      = "${azurerm_resource_group.project_cloud.name}"
  location                 = "francecentral"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}


resource "azurerm_app_service_plan" "project_cloud" {
    name                = "cloudXAppServicePlan"
    location            = "${azurerm_resource_group.project_cloud.location}"
    resource_group_name = "${azurerm_resource_group.project_cloud.name}"
    sku {
        tier = "Standard"
        size = "S1"
    }
}

resource "azurerm_app_service" "project_cloud" {
    name                = "cloudXAppService"
    location            = "${azurerm_resource_group.project_cloud.location}"
    resource_group_name = "${azurerm_resource_group.project_cloud.name}"
    app_service_plan_id = "${azurerm_app_service_plan.project_cloud.id}"
    app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "10 LTS"
  }
}

