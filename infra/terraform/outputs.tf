output "cluster_name" {
  value = aws_eks_cluster.main.name
}

output "cluster_endpoint" {
  value = aws_eks_cluster.main.endpoint
}

output "cluster_region" {
  value = var.aws_region
}

output "vpc_id" {
  value = aws_vpc.main.id
}