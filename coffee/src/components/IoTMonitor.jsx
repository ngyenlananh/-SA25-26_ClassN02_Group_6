import React, { useEffect, useState } from 'react';
import { getSensorData } from '../services/iotService';

const IoTMonitor = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		getSensorData().then(setData);
	}, []);

	return (
		<div className="w-full flex flex-col items-center">
			<h2 className="text-xl font-bold mb-4 text-[#d4a373]">Dữ liệu cảm biến IoT</h2>
			<div className="overflow-x-auto w-full">
				<table className="min-w-[600px] w-full rounded-xl overflow-hidden shadow-lg bg-[#222]">
					<thead>
						<tr className="bg-[#333] text-[#d4a373] text-base">
							<th className="py-3 px-4 text-center font-semibold">Thiết bị</th>
							<th className="py-3 px-4 text-center font-semibold">Loại</th>
							<th className="py-3 px-4 text-center font-semibold">Giá trị</th>
							<th className="py-3 px-4 text-center font-semibold">Đơn vị</th>
							<th className="py-3 px-4 text-center font-semibold">Thời gian</th>
						</tr>
					</thead>
					<tbody>
						{data.map((d) => {
							const isLowStock = d.type === 'material' && d.value < 10;
							return (
								<tr
									key={d._id}
									className={
										(isLowStock ? 'bg-red-200/80 text-red-700 font-semibold animate-pulse ' : 'hover:bg-[#292929]') +
										' transition-all duration-150 text-center'
									}
									style={{ borderBottom: '1px solid #333' }}
								>
									<td className="py-2 px-4">{d.deviceId}</td>
									<td className="py-2 px-4 capitalize">{d.type}</td>
									<td className="py-2 px-4">
										{d.value}
										{isLowStock && (
											<span className="ml-2 text-red-700 font-bold text-sm">
												&#9888; Cảnh báo tồn kho!
											</span>
										)}
									</td>
									<td className="py-2 px-4">{d.unit}</td>
									<td className="py-2 px-4">
										{new Date(d.timestamp).toLocaleString()}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default IoTMonitor;
