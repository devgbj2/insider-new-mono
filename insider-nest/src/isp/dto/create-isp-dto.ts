import { IsString, IsBoolean, IsNotEmpty, IsOptional, IsLatitude, IsLongitude } from 'class-validator';

export class CreateIspDto {
  @IsString()
  legalName: string;

  @IsString()
  name: string;

  @IsString()
  bpNumber: string;

  @IsString()
  asnNumber: string;

  @IsString()
  caNumber: string;

  @IsString()
  tifBpNumber: string;

  @IsBoolean()
  isKominfo: boolean;

  @IsBoolean()
  isAsn: boolean;

  @IsBoolean()
  isCustomer: boolean;

  @IsBoolean()
  isJartup: boolean;

  @IsBoolean()
  isJartaplok: boolean;

  @IsString()
  internalRiskProfile: string;

  @IsString()
  collectionRate: string;

  @IsString()
  size: string;

  @IsString()
  quality: string;

  @IsString()
  scale: string;

  @IsString()
  risk: string;

  @IsString()
  customerCoverage: string;

  @IsString()
  headquarter: string;

  @IsString()
  province: string;

  @IsString()
  provinceSyn: string;

  @IsString()
  coverageList: string;

  @IsString()
  coverageListProvince: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsLatitude()
  latitude: number;

  @IsOptional()
  @IsLongitude()
  longitude: number;
}