locals {
  terraform_state_bucket_name = "${var.project_name}-${var.environment}-terraform-state"
  backups_bucket_name         = "${var.project_name}-${var.environment}-backups"
  assets_bucket_name          = "${var.project_name}-${var.environment}-assets"
}

# Terraform State Bucket
resource "digitalocean_spaces_bucket" "terraform_state" {
  name   = local.terraform_state_bucket_name
  region = var.region
  
  acl = "private"
  
  lifecycle {
    prevent_destroy = true
  }
}

# Backups Bucket
resource "digitalocean_spaces_bucket" "backups" {
  name   = local.backups_bucket_name
  region = var.region
  
  acl = "private"
  
  lifecycle {
    prevent_destroy = false
  }
}

# Assets Bucket
resource "digitalocean_spaces_bucket" "assets" {
  name   = local.assets_bucket_name
  region = var.region
  
  acl = "public-read"
  
  lifecycle {
    prevent_destroy = false
  }
}
