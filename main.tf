resource "azurerm_resource_group" "projet_cloud" {
  name     = "project_cloud"
  location = "francecentral"

  tags {
    Owner = "Souissi Mohamed"
  }
}

resource "azurerm_storage_account" "projet_cloud" {
  name                     = "storagecloudx"
  resource_group_name      = "${azurerm_resource_group.projet_cloud.name}"
  location                 = "francecentral"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

